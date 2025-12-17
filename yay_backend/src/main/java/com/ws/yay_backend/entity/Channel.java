package com.ws.yay_backend.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "channels")
public class Channel {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name", length = 35, nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "community_id", nullable = false)
  private Community community;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "channel")
  List<ChannelMessage> channelMessages;

  public Channel() {}

  public Channel(String name, Community community, List<ChannelMessage> channelMessages) {
    this.name = name;
    this.community = community;
    this.channelMessages = channelMessages;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Community getCommunity() {
    return community;
  }

  public void setCommunity(Community community) {
    this.community = community;
  }

  public List<ChannelMessage> getChannelMessages() {
    return channelMessages;
  }

  public void setChannelMessages(List<ChannelMessage> channelMessages) {
    this.channelMessages = channelMessages;
  }
}
